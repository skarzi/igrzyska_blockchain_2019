import * as React from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView, } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer } from 'mobx-react-lite';
import { Button, Header, Screen, Text, Wallpaper, TextField } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models/root-store"

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

export interface ConfirmScreenProps extends NavigationScreenProps<{}> {}

export const ConfirmScreen: React.FunctionComponent<ConfirmScreenProps> = observer(props => {
  // const nextScreen = React.useMemo(() => () => props.navigation.navigate("demo"), [
  //   props.navigation,
  // ])
  const { fundingsStore, navigationStore } = useStores()

  const [password, setPassword] = React.useState('');
  const handleConfirm = () => {
    fundingsStore.setPassword(password)
  }

  if (fundingsStore.password !== '' && fundingsStore.password !== null) {
    navigationStore.navigateTo('confirmWithNfc')
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="ESFP" />
        </Text>

        <TextField
          inputStyle={INPUT_STYLE}
          label="Your password"
          autoCompleteType="off"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={CONTENT}>
          Your password will be used to confirm your identity
          with use of NFC card.
        </Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.confirm"
            onPress={handleConfirm}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
