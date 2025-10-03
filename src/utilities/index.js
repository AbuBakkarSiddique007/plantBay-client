export const shortImageName = (image, length = 10) => {
    console.log(image);

    // If image is falsy or not a string, return default
    if (!image || typeof image !== 'string') return 'Choose Image';

    // If the filename is short enough, return it as-is
    if (image.length <= 15) return image;

    // Extract the file extension
    const lastDotIndex = image.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? image.substring(lastDotIndex + 1) : '';

    // Return shortened name with extension
    return image.substring(0, length).concat(`...${extension}`);
};
