export interface CartItem {
  id: string
  color: string
  size: string
  quantity: number
}

export interface Cart {
  id: string
  items: CartItem[]
}
