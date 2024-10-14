import React from 'react';

export default async function CordenadasCity(latitude, longitude) {
  console.log(latitude, longitude);
  const username = "vitor_has08";

  try {
    const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${username}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados da API.');
    }

    const data = await response.json();
    if (data.geonames && data.geonames.length > 0) {
      return data.geonames[0].name;
    } else {
      console.log("Cidade não encontrada.");
      return null;
    }
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
}
