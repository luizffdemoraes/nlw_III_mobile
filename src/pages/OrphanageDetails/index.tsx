import React, { useState, useEffect} from 'react';
import { Image, View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather, FontAwesome } from '@expo/vector-icons';

import mapMarkerImg from '../../images/map-marker.png';
import { RectButton} from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import api from '../../services/api';

import styles from './styles';

interface OrphanageDetailRouteParams{
  id: number;
}

interface Orphanage{
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function OrphanageDetails() {

  const route = useRoute();
  const params = route.params as OrphanageDetailRouteParams;
  //console.log(params.id);

  const [ orphanageDetail, setOrphanageDetail ] = useState<Orphanage>();

  async function  loadOrphanageDetail() {
    await api.get(`orphanages/${params.id}`).then(res => {
        let detail = res.data;
        setOrphanageDetail(res.data);
        console.log(detail);
        
    }).catch(err => {
      console.log(err.response)
    });
  }

  useEffect(() => {
    loadOrphanageDetail();
  }, [params.id]);


  if(!orphanageDetail){
    return(
      <View style={styles.container}>
          <Text style={styles.description}>Carregando...</Text>

      </View>
    );
  }

  //`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`

  function handleOpenGoogleMapRoutes(){
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanageDetail?.latitude},${orphanageDetail?.longitude}`);
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        <ScrollView horizontal pagingEnabled>
          {orphanageDetail.images.map(image => {
            return(
              <Image key={image.id} style={styles.image} source={{ uri: image.url }} />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{orphanageDetail.name}</Text>
        <Text style={styles.description}>{orphanageDetail.about}</Text>
      
        <View style={styles.mapContainer}>
          <MapView 
            initialRegion={{
              latitude: orphanageDetail.latitude,
              longitude: orphanageDetail.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }} 
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker 
              icon={mapMarkerImg}
              coordinate={{ 
                latitude: orphanageDetail.latitude,
                longitude: orphanageDetail.longitude
              }}
            />
          </MapView>

          <TouchableOpacity onPress={handleOpenGoogleMapRoutes} style={styles.routesContainer}>
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>
      
        <View style={styles.separator} />

        <Text style={styles.title}>Instruções para visita</Text>
            <Text style={styles.description}>{orphanageDetail.instructions}</Text>

        <View style={styles.scheduleContainer}>
          <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
            <Feather name="clock" size={40} color="#2AB5D1" />
            <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>{orphanageDetail.opening_hours}</Text>
          </View>
          {orphanageDetail.open_on_weekends ? (
            <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
              <Feather name="info" size={40} color="#39CC83" />
                  <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>Atendemos fim de semana</Text>
            </View>            
          ) : (
            <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
              <Feather name="info" size={40} color="#ff669d" />
                  <Text style={[styles.scheduleText, styles.scheduleTextRed]}>Não atendemos fim de semana</Text>
            </View>            
          )}
        </View>

        <RectButton style={styles.contactButton} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </RectButton>
      </View>
    </ScrollView>
  )
}

