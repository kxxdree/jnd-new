import type { City } from './types'

export const cities: City[] = [
  { id: 'moscow', name: 'Москва', where: 'в Москве', lat: 55.7558, lng: 37.6173 },
  { id: 'spb', name: 'Санкт-Петербург', where: 'в Петербурге', lat: 59.9343, lng: 30.3351 },
  { id: 'kazan', name: 'Казань', where: 'в Казани', lat: 55.7963, lng: 49.1088 },
  { id: 'ekb', name: 'Екатеринбург', where: 'в Екатеринбурге', lat: 56.8389, lng: 60.6057 },
  { id: 'nsk', name: 'Новосибирск', where: 'в Новосибирске', lat: 55.0084, lng: 82.9357 },
  { id: 'voronezh', name: 'Воронеж', where: 'в Воронеже', lat: 51.6608, lng: 39.2003 },
  { id: 'lipetsk', name: 'Липецк', where: 'в Липецке', lat: 52.6031, lng: 39.5708 },
]

export const cityName = (id: string) => cities.find(c => c.id === id)?.name ?? id
export const getCity = (id: string) => cities.find(c => c.id === id)
