import React, { useState, useEffect} from 'react';
import { Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import mapMarker from '../../images/map-marker.png';
import styles from './styles';
import api from '../../services/api';

interface Orphanage{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export default function OrphanagesMap() {

    const navigation = useNavigation();

    const [ orphanages, setOrphanages ] = useState<Orphanage[]>([]);

    async function LoadOrphanages() {

        await api.get('orphanages').then(res => {

            setOrphanages(res.data);

        }).catch(err => {

            console.log(err.response)

        });
        
    }


    useFocusEffect(() => {
        LoadOrphanages();
    })

    function handleNavigateToOrphanageDetails(id: number){
        navigation.navigate('OrphanageDetails', { id })
    }

    function handleNavigateToCreateOrphanage(){
        navigation.navigate('SelectMapPosition')
    }



    return (

        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: -23.5421585,
                    longitude: -46.3166478,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
            >
                {orphanages.map(orphanage => {
    
                    return(
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8
                            }}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}
                            >
                                <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                                    <View style={styles.calloutContainer}>
                                        <Text style={styles.calloutText}>{orphanage.name}</Text>
                                    </View>
                                </Callout>
                        </Marker>                        
                    );
                })}
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} Orfanatos encontrado!</Text>

                <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
                    <Feather name="plus" size={20} color="#fff" />
                </RectButton>
            </View>
        </View>


    );
}

