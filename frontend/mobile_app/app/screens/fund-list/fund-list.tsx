import * as React from "react"
import { View, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer } from 'mobx-react-lite';
import { Header, Screen, Text, Wallpaper, Button, TextField } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from '../../models/root-store';

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
const LINK: TextStyle = {
  margin: 10
}
const MARGIN_BOTTOM: ViewStyle = {
  marginBottom: 15
}

export interface FundListScreenProps extends NavigationScreenProps<{}> {}

export const FundListScreen = observer((props) => {
  const { fundingsStore, navigationStore } = useStores();
  const [selectedId, setSelectedId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const handleFundingPress = (id) => {
    setSelectedId(id)
  }
  const getFunding = () => {
    return fundingsStore.fundings
      .find((funding) => funding.id === parseInt(selectedId, 10))
  }
  const fundingListMode = selectedId === '';
  const selectedFunding = fundingListMode ? null : getFunding();
  const title = fundingListMode
    ? "Fundings list"
    : "Selected funding";
  const backHandler = fundingListMode
    ? () => navigationStore.navigateTo('main')
    : () => setSelectedId('');
  const handleInvest = () => {
    fundingsStore.invest(selectedId, amount)
  }

  React.useEffect(() => {
    fundingsStore.getFundings()
  }, [])

  if (fundingsStore.confirmationNeeded) {
    navigationStore.navigateTo('confirm')
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header
          leftIcon="back"
          onLeftPress={backHandler}
          headerTx="welcomeScreen.poweredBy"
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />

        <Text style={[TITLE_WRAPPER, MARGIN_BOTTOM]}>
          <Text style={TITLE} text={title} />
        </Text>

        {fundingListMode ? (
          <>
            {fundingsStore.fundings.map((funding, index) => {
              return (
                <Button
                  onPress={() => handleFundingPress(funding.id)}
                  textStyle={[TEXT, LINK]}
                  preset="link"
                  key={index}
                  text={funding.name}
                />
              );
            })}
          </>
        ) : (
          <>
            <Text style={TEXT}>Funding name: {selectedFunding.name}</Text>
            <Text style={TEXT}>Funding description: {selectedFunding.description}</Text>
            <Text style={TEXT}>Soft Cap: {selectedFunding.soft_cap}</Text>
            <Text style={TEXT}>Token Price: {selectedFunding.token_price}</Text>
            <Text style={TEXT}>Tokens Amount: {selectedFunding.tokens_amount}</Text>
            <Text style={[TEXT, MARGIN_BOTTOM]}>Number of investors: {selectedFunding.entries.length}</Text>
            <TextField
              label="Invest amount"
              value={amount}
              onChangeText={setAmount}
            />
            <Button
              text="Invest"
              onPress={handleInvest}
            />
          </>
        )}
      </Screen>
    </View>
  )
})
