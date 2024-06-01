import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';

const { width } = Dimensions.get('screen');

const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.9;

const Home = () => {
    const tabBarheight = useBottomTabBarHeight();
    return (
        <View style={styles.container}><View style={styles.contentContainer}><Text style={styles.title}>Home</Text></View>

            {/* Scrollable Content */}
            <View style={styles.scrollContainer}><ScrollView
                indicatorStyle="white"
                contentContainerStyle={[
                    styles.scrollContentContainer,
                    { paddingBottom: tabBarheight },
                ]}>
            </ScrollView>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    contentContainer: {
        marginTop: 50,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        color: '#fff',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 14,
    },
    imageCard: {
        borderRadius: 14,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
    },
});