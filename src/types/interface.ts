export interface SaveOptions {
  filename: string,
  prettify?: boolean,
  spaces?: number
}

export interface API {
  data: any,
  save: (options: SaveOptions) => void
}