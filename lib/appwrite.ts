import { Account, Client, ID } from 'react-native-appwrite';

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)  
  .setProject(config.projectId) 
  .setPlatform(config.platform);  


const account = new Account(client);

export { account, ID };
