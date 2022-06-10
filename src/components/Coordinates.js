import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore} from '@firebase/firestore';
import app from "../firebase"


function Coordinates() {

    const [coordinates, setCoordinates] = useState([]);
    const db = getFirestore(app);
    const coordinatesCollectionRef = collection(db, "coordinates")

    useEffect(() =>{

        const getCoordinates = async () => {
            const data = await getDocs(coordinatesCollectionRef);
            setCoordinates(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getCoordinates();
    }, [])

    console.log(coordinates);

    return (
        <div>
            {coordinates.map((coordinate) => {
                return (
                    <div className="border border-dark mt-3 rounded p-2" style={{backgroundColor: '#D3E0EA '}}>
                        <h5 style={{color: '#276678 '}} className="mt-1 text-center">Location: {coordinate.location}</h5>
                        <h6 style={{color: '#276678 '}} className="text-center">Latitude: {coordinate.latitude}</h6>
                        <h6 style={{color: '#276678 '}} className="text-center">Longitude: {coordinate.longitude}</h6>
                    </div>
                );
            })}
        </div>
    )
}

export default Coordinates;