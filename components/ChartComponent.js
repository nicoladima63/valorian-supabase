import { StyleSheet, View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
export default function ChartComponent() {
    option = {
        xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: "line"
            }
        ]
    };

        return (
            <View>
                <ECharts
                    option={this.option}
                    backgroundColor="rgba(93, 169, 81, 0.3)"
                />
            </View>
        );
}

const styles = StyleSheet.create({
    chartContainer: {
        flex: 1
    }
});