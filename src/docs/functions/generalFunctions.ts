
import { storage,  firestore } from "../../constants/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const updateImage = async (imgFile: File ) => {

    const storageRef = ref(storage, `/files/${imgFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    var urlImage: string = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
              const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(percent);
          },
          (err) => reject(err),
          () => {
              // download url
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url)
                resolve(url);
              });
          }
        );
      });

    return urlImage;

};

const validLoginWithFirebase = (email: string, password: string) => {
  const auth = getAuth();
  const userData = signInWithEmailAndPassword(auth, email, password)
  .then(async(userCredential) => {
    const docRef = doc(firestore, "Users", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data : docSnap.data(), error : false, message : ""}
    } else {
      return { data:{}, error: true, message : "No such document!"}
    } 
  })
  .catch((error) => {
   return { data:{}, error: true, message : error.code}
  });

  return userData;
}

export {
    updateImage,
    validLoginWithFirebase
}