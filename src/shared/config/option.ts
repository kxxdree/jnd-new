/** Общий тип для словарей (жанры, форматы и т.п.) */
export interface Option<T extends string = string> {
  id: T
  name: string
}
