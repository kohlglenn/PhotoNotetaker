import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const containerStyle = {
  width: '400px',
  height: '400px'
};

function MyComponent(props) {
  const { center, setLatLng, zoom, draggable } = props;
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
        {/* Child components, such as markers, info windows, etc. */}
        <Marker
          position={center}
          draggable={draggable}
          onDragEnd={(e) =>
            setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
        />
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

MyComponent.defaultProps = {
  zoom: 15,
  draggable: true,
  setLatLng: null
};

MyComponent.propTypes = {
  center: PropTypes.object.isRequired,
  setLatLng: PropTypes.func,
  zoom: PropTypes.number,
  draggable: PropTypes.bool
};

export default React.memo(MyComponent);
