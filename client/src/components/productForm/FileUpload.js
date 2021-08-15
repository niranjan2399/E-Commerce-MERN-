import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import axios from "../../axios";

function FileUpload({ values, setValues, loading, setLoading }) {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            try {
              const res = await axios.post(
                "/uploadimages",
                { image: uri },
                {
                  headers: {
                    authtoken: user.token,
                  },
                }
              );
              setLoading(false);
              allUploadFiles.push(res.data);

              setValues({ ...values, images: allUploadFiles });
            } catch (err) {
              setLoading(false);
              console.log(err);
            }
          },
          "base64"
        );
      }
    }
  };

  return (
    <div className="npContainer__addImage">
      <label>
        {loading ? (
          <CircularProgress
            style={{ width: "1.5rem", height: "1.5rem", color: "#8167a9" }}
          />
        ) : (
          "Choose Images"
        )}
        <input
          type="file"
          name="productImages"
          accept="images/*"
          multiple
          onChange={fileUploadAndResize}
          hidden
        />
      </label>
    </div>
  );
}

export default FileUpload;
