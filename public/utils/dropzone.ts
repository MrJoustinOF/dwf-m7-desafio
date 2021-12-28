import { Dropzone } from "dropzone";
import { state } from "../state";

export const initDropzone = () => {
  const myDropzone = new Dropzone(".dropzone", {
    url: "/file/post",
    autoProcessQueue: false,
  });
  const dropzoneContainer = document.querySelector(".dropzone");
  dropzoneContainer.firstElementChild.remove();

  myDropzone.on("thumbnail", function (file) {
    const currentImage: HTMLImageElement =
      document.querySelector(".current-image");
    const { dataURL } = file;

    dropzoneContainer.lastElementChild.remove();
    state.setState({
      ...state.getState(),
      imageData: dataURL,
    });

    currentImage.src = dataURL;
  });
};
