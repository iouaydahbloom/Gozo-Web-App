import { Magic } from 'magic-sdk';
import React from 'react';

const magicAuthContext = React.createContext<{  magic: Magic | null }>({  magic: null })

export { magicAuthContext }