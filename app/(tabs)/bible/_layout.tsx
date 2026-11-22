import { Stack } from 'expo-router'

export default function BibleLayout() {
  return (
    <Stack
      screenOptions={Object.assign({ headerShown: false }, { detachInactiveScreens: true })}
    />
  )
}
