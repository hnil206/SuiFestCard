import axiosClient from '../axiosClient';

const getUserAvatar = async (userName: string, bearerUrl: string) => {
  const response = await axiosClient.get(`users/by/username/${userName}?user.fields=profile_image_url`, {
    headers: {
      Authorization: `Bearer ${bearerUrl}`,
    },
  });
  return response;
};

export default getUserAvatar;
