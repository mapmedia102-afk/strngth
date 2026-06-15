'use client';
import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/strngth/firebase';
import { useStrngthStore } from '@/lib/strngth/store';
import { SyncableState } from '@/lib/strngth/userData';
import { ensureUserDoc, subscribeUser, pushUserDoc, addSession, loadRecentSessions, cleanMockPRs, cleanMockPlayerData } from '@/lib/strngth/sync';

type State = ReturnType<typeof useStrngthStore.getState>;

function sliceOf(s: State): SyncableState {
  return {
    player: s.player,
    badges: s.badges,
    dailyQuests: s.dailyQuests,
    weeklyQuests: s.weeklyQuests,
    notificationSettings: s.notificationSettings,
    privacySettings: s.privacySettings,
    programs: s.programs,
    theme: s.theme,
    onboarded: s.onboarded,
    onboarding: s.onboarding,
  };
}

/**
 * Headless component: keeps Firestore and the Zustand store in sync per Auth UID.
 *
 * KEY FIX: We wait for auth.authStateReady() before subscribing to
 * onAuthStateChanged. Without this, Firebase fires the callback with user=null
 * immediately on mount (before it reads the persisted session from IndexedDB),
 * which triggers resetToDefaults() → onboarded=false → redirect to welcome
 * screen even though the user is still logged in.
 */
export default function FirebaseSync() {
  const uidRef = useRef<string | null>(null);
  const unsubCloud = useRef<(() => void) | null>(null);
  const unsubStore = useRef<(() => void) | null>(null);
  const unsubAuth = useRef<(() => void) | null>(null);
  const applyingCloud = useRef(false);
  const lastSlice = useRef('');
  const lastSessionId = useRef<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const detach = () => {
      unsubCloud.current?.();
      unsubStore.current?.();
      unsubCloud.current = null;
      unsubStore.current = null;
      uidRef.current = null;
      lastSlice.current = '';
      lastSessionId.current = null;
    };

    const subscribe = () => {
      if (!mountedRef.current) return;

      unsubAuth.current = onAuthStateChanged(auth, async user => {
        detach();

        if (!user) {
          useStrngthStore.getState().resetToDefaults();
          return;
        }

        uidRef.current = user.uid;

        try {
          await ensureUserDoc(user.uid, user, sliceOf(useStrngthStore.getState()));
          if (uidRef.current !== user.uid) return;

          await cleanMockPlayerData(user.uid);
          if (uidRef.current !== user.uid) return;

          await cleanMockPRs(user.uid);
          if (uidRef.current !== user.uid) return;

          const sessions = await loadRecentSessions(user.uid);
          if (uidRef.current !== user.uid) return;
          useStrngthStore.setState({ workoutHistory: sessions });
          lastSessionId.current = sessions[0]?.id ?? null;
        } catch (e) {
          const err = e as { name?: string; code?: string };
          const isOffline = err?.name === 'AbortError' || err?.code === 'unavailable' || err?.code === 'failed-precondition';
          if (!isOffline) console.error('[strngth] user setup failed', e);
          return;
        }

        unsubCloud.current = subscribeUser(user.uid, cloud => {
          applyingCloud.current = true;
          useStrngthStore.getState().hydrateFromCloud(cloud);
          applyingCloud.current = false;
        });

        lastSlice.current = JSON.stringify(sliceOf(useStrngthStore.getState()));
        unsubStore.current = useStrngthStore.subscribe(state => {
          const uid = uidRef.current;
          if (!uid) return;

          if (state.lastSession && state.lastSession.id !== lastSessionId.current) {
            lastSessionId.current = state.lastSession.id;
            addSession(uid, state.lastSession);
          }

          if (applyingCloud.current) return;
          const slice = sliceOf(state);
          const json = JSON.stringify(slice);
          if (json === lastSlice.current) return;
          lastSlice.current = json;
          pushUserDoc(uid, slice);
        });
      });
    };

    // Wait until Firebase has restored the persisted auth session from
    // IndexedDB before subscribing. This prevents the spurious null→user
    // double-fire that resets the store and kicks the user to onboarding.
    auth.authStateReady().then(subscribe).catch(subscribe);

    return () => {
      mountedRef.current = false;
      unsubAuth.current?.();
      detach();
    };
  }, []);

  return null;
}
