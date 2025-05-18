import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

// -------------- Upload image ----------------

const postImageData = async (data: any) => {
  const res = await axios
    .post('https://api.nft.storage/upload/', data, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY!}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data.value.cid)

  return res
}

export const useIpfsImageUpload = () => {
  return useMutation((data: any) => postImageData(data), {
    onError(err: any) {
      toast.error(err.message || 'Failed to upload image to NFTStorage', {
        id: 'apiError',
      })
    },
  })
}
