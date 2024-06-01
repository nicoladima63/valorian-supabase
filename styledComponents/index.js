// src/styledComponents/index.js
import styled from 'styled-components/native';
import { Icon } from 'react-native-elements';
import { buttonColors } from '../constants/buttonColors';

export const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    padding-top: 25px;
`;
export const LayoutView = styled.View`
    flex: 1;
    padding-top: 10px;
`;
export const Title14 = styled.Text`
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: ${(props) => props.theme.title.color};
`;
export const Title16 = styled.Text`
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    color: ${(props) => props.theme.title.color};
`;
export const Title18 = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: ${(props) => props.theme.title.color};
`;
export const Title20 = styled.Text`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: ${(props) => props.theme.title.color};
`;
export const TextContentLeft = styled.Text`
    font-size: 16px;
    text-align: left;
    color: ${(props) => props.theme.textContent.color};
`;
export const TextContentCenter = styled.Text`
    font-size: 16px;
    text-align: center;
    color: ${(props) => props.theme.textContent.color};
`;
export const TextContentJustify = styled.Text`
    font-size: 16px;
    text-align: justify;
    color: ${(props) => props.theme.textContent.color};
`;
export const TextContentRight = styled.Text`
    font-size: 16px;
    text-align: right;
    color: ${(props) => props.theme.textContent.color};
`;
export const SubHeaderAlert = styled.View`
    margin-top: 50px;
    padding: 20px;
    height: 70px;
    width: 80%;
    background-color: ${(props) => props.theme.subHeader.backgroundColor};
`;
export const SubHeaderAlertText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    align-items: center;
    text-align: center;
`;
export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;
export const Header = styled.View`
    align-items: center;
    padding: 40px 0 20px 0;
`;
export const ButtonContainerSE = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
    //justify-content: space-between;
    margin-top: 40px;
    padding-top: 8px;
    padding-bottom: 4px;
    align-self: stretch;
`;
export const Button2 = styled.Pressable`
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    elevation: 3;
    width: 60%;
    background-color: ${(props) => buttonColors[props.bgColor] || buttonColors.default};
`;
export const Button = styled.Pressable`
    align-items: center;
    justify-content: center;
    //padding-vertical: 12px;
    //padding-horizontal: 32px;
    border-radius: 4px;
    elevation: 3;
    width: 40%;
    background-color: ${(props) => buttonColors[props.bgColor] || buttonColors.default};
`;
export const TopBarContainer = styled.View`
    background-color: ${(props) => props.theme.topBarHeader.backgroundColor};
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;
export const TopBarAvatarContainer = styled.TouchableOpacity`
    padding: 20px;
    margin-left: 10px;
`;
export const TopBarTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.topBarTitle.color};
`;
export const TopBarIcon2 = styled(Icon).attrs((props) => ({
    marginRight: props.theme.topBarIcon?.marginRight || '30px',
    color: props.theme.topBarIcon.color,
}))``;

export const TopBarIcon = styled(Icon)`
    margin-right: 20px;
    color: ${(props) => props.theme.topBarIcon.color};
`;
export const MainContainer = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.mainContainer.backgroundColor};
`;
