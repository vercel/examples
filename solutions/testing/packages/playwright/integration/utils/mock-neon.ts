interface NeonResponse<
  Fields extends readonly { name: string; dataTypeID: number }[]
> {
  command: string
  fields: Fields
  rows: unknown[]
  rowCount: number
  rowAsArray: boolean
  viaNeonFetch: boolean
}

export function createNeonMock<
  Fields extends readonly { name: string; dataTypeID: number }[]
>(fields: Fields) {
  function neonMock(
    command: string,
    data: Record<Fields[number]['name'], any>[]
  ): NeonResponse<Fields> {
    const rows = data.map((obj) =>
      fields.map((f) => obj[f.name as Fields[number]['name']])
    )

    return {
      command,
      fields,
      rows,
      rowCount: rows.length,
      rowAsArray: false,
      viaNeonFetch: true,
    }
  }

  return neonMock
}
