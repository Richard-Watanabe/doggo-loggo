import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getLogsByDogId(dogId) {
  const q = query(
    collection(db, 'logs'),
    where('dogId', '==', dogId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    logId: doc.id,
    ...doc.data()
  }));
}

export async function getDogPhoto(dogId) {
  const ref = doc(db, 'photos', dogId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : { url: null };
}

export async function getDogName(dogId) {
  const ref = doc(db, 'dogs', dogId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data().dogName : 'Name';
}
