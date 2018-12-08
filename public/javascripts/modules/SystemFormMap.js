import { $, $$ } from './Bling';

function SystemFormMap() {
    const latInput = $('#SF_lat');
    const lngInput = $('#SF_lng');
    const imgElement = $('#SF_map');

    if (!latInput || !lngInput || !imgElement) return;

    const updateImage = () => {
        const lat = latInput.value;
        const lng = lngInput.value;

        if (!lat || !lng) return;

        imgElement.src = `/api/staticmap?lat=${lat}&lng=${lng}`;
    };

    latInput.on('change', updateImage);
    lngInput.on('change', updateImage);
    updateImage();
}

export default SystemFormMap;
