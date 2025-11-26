
'use client';

import { addDoc, collection, doc, Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { differenceInMinutes } from 'date-fns';

interface UpdateProgressParams {
    firestore: Firestore;
    userId: string;
    studentProfileId: string;
    studyPlanId: string;
    studySessionId: string;
    sessionStartTime: Date;
}

export function updateProgress({
    firestore,
    userId,
    studentProfileId,
    studyPlanId,
    studySessionId,
    sessionStartTime,
}: UpdateProgressParams): void {
    const now = new Date();
    
    // Calculate duration in minutes
    const duration = differenceInMinutes(now, sessionStartTime);

    // Prepare progress data
    const progressData = {
        studyPlanId: studyPlanId,
        studySessionId: studySessionId,
        date: serverTimestamp(),
        duration: duration > 0 ? duration : 1, // Log at least 1 minute
    };

    // Get a reference to the progress subcollection
    const progressCollectionRef = collection(
        firestore,
        `users/${userId}/studentProfiles/${studentProfileId}/studyPlans/${studyPlanId}/progress`
    );

    // Add the new progress document (non-blocking)
    addDoc(progressCollectionRef, progressData)
        .catch(error => {
            console.error("Error saving progress:", error);
            const permissionError = new FirestorePermissionError({
                path: progressCollectionRef.path,
                operation: 'create',
                requestResourceData: progressData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}
