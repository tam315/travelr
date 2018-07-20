import { LatLng } from '../config/types';

export const getPositionFromPlaceName = placeName =>
  new Promise<LatLng>((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: placeName }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        reject(new Error('市町村名・建物名から緯度経度を検索できませんでした'));
      }
    });
  });
