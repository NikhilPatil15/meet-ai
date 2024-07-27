const generateMeetingLink = () => {
    const baseUrl = 'https://meetai.com/';
    const randomString = Math.random().toString(36).substring(2, 11); // Ensures a 9-character string
    const formattedString = `${randomString.substring(0, 3)}-${randomString.substring(3, 6)}-${randomString.substring(6, 9)}`;
    return `${baseUrl}${formattedString}`;
};
  