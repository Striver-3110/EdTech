const cloudinary = require("cloudinary");

exports.uploadVideoToCloudinary = async (file, folder, options = {}) => {
  options.resource_type = "video";
  console.log(file.tempFilePath);

  try {
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type : 'video',
      // ...options,
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    throw error;
  }
};
