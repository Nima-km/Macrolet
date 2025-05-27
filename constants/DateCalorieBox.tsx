import { SkFont } from "@shopify/react-native-skia";
import { View } from "react-native";



interface BarProgressProps {
    strokeWidth: number;
    backgroundColor: string;
    calorieTarget: number;
    calorieEnd: number
    smallerFont?: SkFont;
}


export const DateCalorieBox: React.FC<BarProgressProps> = ({
    strokeWidth,
    backgroundColor,
    calorieTarget,
    calorieEnd,
    smallerFont,
}) => {
    return (
        <View>
            
        </View>
    )
}