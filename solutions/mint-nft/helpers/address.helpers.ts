const getAddressFirstCharacters = (address: string) => address.slice(0, 5)

const getAddressLateCharacters = (address: string) =>
  address.slice(address.length - 6, address.length - 1)

export const getShortenedAddress = (address: string) =>
  `${getAddressFirstCharacters(address)}...${getAddressLateCharacters(address)}`
