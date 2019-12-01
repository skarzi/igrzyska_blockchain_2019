import * as React from "react"
import { View, ViewStyle, TextStyle, ImageStyle, ActivityIndicator, } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer } from 'mobx-react-lite';
import { Button, Header, Screen, Text, Wallpaper  } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from '../../models/root-store';
import { NavigationStoreModel } from "../../navigation/navigation-store";

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const INPUT_STYLE: TextStyle = {
  color: color.text
}
const MARGIN: ViewStyle = {
  marginBottom: 15
}

export interface ConfirmWithNfcScreenProps extends NavigationScreenProps<{}> {}

export const ConfirmWithNfcScreen: React.FunctionComponent<ConfirmWithNfcScreenProps> = observer(props => {
  // const nextScreen = React.useMemo(() => () => props.navigation.navigate("demo"), [
  //   props.navigation,
  // ])

  const { fundingsStore, navigationStore } = useStores()

  React.useEffect(() => {
    fundingsStore.waitForNfc()
  }, [])

  if (fundingsStore.confirmationWithNfcStatus === 'done') {
    fundingsStore.reset();
    navigationStore.navigateTo('success')
  }


  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
        <Text style={[TITLE_WRAPPER, MARGIN]}>
          <Text style={TITLE} text="Confirm With Nfc" />
        </Text>

        {fundingsStore.confirmationWithNfcStatus === 'pending' ? (
          <ActivityIndicator size='large' />
        ) : (
          <Text>Thanks for your contribution</Text>
        )}
      </Screen>
    </View>
  )
})
