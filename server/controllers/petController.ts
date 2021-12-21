import { Pet } from "../models";
import { algoliaIndex } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

const savePet = async (req, res) => {
  const { name, imageData, lat, lng, refPlace, UserId } = req.body;

  let image;
  await cloudinary.v2.uploader.upload(imageData, function (error, result) {
    image = result.url;
  });

  const pet = await Pet.create({
    name,
    image,
    found: false,
    lat,
    lng,
    refPlace,
    UserId,
  });
  const saveAlgolia = await algoliaIndex.saveObject({
    objectID: pet.get("id"),
    name,
    image,
    found: false,
    refPlace,
    _geoloc: {
      lat,
      lng,
    },
  });
  res.json({ msg: "pet saved" });
};

const getAllPets = async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
};

const getAllUserPets = async (req, res) => {
  const { id } = req.params;
  const pets = await Pet.findAll({ where: { UserId: id } });
  res.json(pets);
};

const getPetsNearMe = async (req, res) => {
  const { lat, lng } = req.params;

  const aroundLatLng = `${lat}, ${lng}`;

  const algoliaResponse = await algoliaIndex.search("", {
    aroundLatLng,
    aroundRadius: 1_000_000,
  });

  res.json(algoliaResponse.hits);
};

const getOnePet = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findOne({ where: { id } });
  res.json(pet);
};

const setPetFound = async (req, res) => {
  const { id } = req.params;

  const pet = await Pet.findOne({ where: { id } });
  const data = {
    name: pet.get("name"),
    image: pet.get("image"),
    found: true,
    lat: pet.get("lat"),
    lng: pet.get("lng"),
    refPlace: pet.get("refPlace"),
  };

  const updatePet = await Pet.update(data, { where: { id } });
  const { name, image, refPlace, lat, lng } = data;
  const updateAlgolia = await algoliaIndex.saveObject({
    objectID: id,
    name,
    image,
    found: true,
    refPlace,
    _geoloc: {
      lat,
      lng,
    },
  });

  res.json({ msg: "pet found" });
};

const updatePet = async (req, res) => {
  const { name, imageData, found, lat, lng, refPlace } = req.body;
  const { id } = req.params;

  let image;
  await cloudinary.v2.uploader.upload(imageData, function (error, result) {
    image = result.url;
  });

  const pet = await Pet.update(
    { name, image, found, lat, lng, refPlace },
    { where: { id } }
  );
  const updateAlgolia = await algoliaIndex.saveObject({
    objectID: id,
    name,
    image,
    found,
    refPlace,
    _geoloc: {
      lat,
      lng,
    },
  });
  res.json({ msg: "pet updated" });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.destroy({ where: { id } });
  const deleteAlgolia = await algoliaIndex.deleteObject(id);

  res.json({ msg: "pet deleted" });
};

export {
  savePet,
  getAllPets,
  getAllUserPets,
  getPetsNearMe,
  getOnePet,
  setPetFound,
  updatePet,
  deletePet,
};
