export const BaseTheme = (colors) => ({
    container: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
    },
    content: {
        flex:1,
        //flexDirection: 'row',
        //alignItems: 'center',
        //justifyContent: 'space-between'
        padding:8,
    },
    containerBorder: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        marginTop:10
    },
    image: {
        height: 160,
        width: 170
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        color: colors.text
    },
    paragrafo: {
        fontSize: 16,
        //fontWeight: "bold",
        //textTransform: "uppercase",
        //textAlign: "center",
        color: colors.text
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 10,
    },
    // stayElevated
    stayElevated: {
        margin: 4,
        backgroundColor: 'white',
        borderRadius: 4,
        //flex: 1,
        padding: 8,
    },
    //TOPBAR
    topBarContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor:colors.background
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    topBarIcon: {
        marginLeft: 20,
    },
    topBarAvatarContainer: {
        marginRight: 20,
    },
    buttonContainer: {
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        //borderColor: colors.grey5,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 10,
    },
    //login
    Logincontainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: colors.background
    },
    Loginimage: {
        height: 160,
        width: 170
    },
    Logintitle: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: colors.primary
    },
    LoginSubtitle: {
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 20,
        color: colors.secondary
    },
    LogininputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    Logininput: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: colors.grey,
        borderWidth: 1,
        borderRadius: 7,
        color: colors.grey
    },
    LoginrememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 8
    },
    Loginswitch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    LoginrememberText: {
        fontSize: 13,
        color: colors.grey,
    },
    LoginforgetText: {
        fontSize: 11,
        color: colors.secondary
    },
    Loginbutton: {
        backgroundColor: colors.primary,
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    LoginbuttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    LoginbuttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    LoginoptionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    LoginmediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    Loginicons: {
        width: 40,
        height: 40,
    },
    LoginfooterText: {
        textAlign: "center",
        color: colors.primary,
    },
    Loginsignup: {
        color: colors.secondary,
        fontSize: 13
    }
})
