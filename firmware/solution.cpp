#include <iostream>
#include <fstream>
#include <sstream>
using namespace std;
#include <string>

#define conversionFactor 0.1;
#define bitLength 16;
const std::string wheelSpeedCANId =  "705";

struct CANData {
    double wheelSpeedFR;
    double WheelSpeedRR;
};

struct CANData extractCANData(std::string data, std::string id);

int main() {
    ofstream output("output.txt");
    ifstream dump("dump.log");

    string line;
    while (getline(dump, line)) {
        istringstream lineStream(line);
        std::string timeStamp, interface, id_data;
        lineStream >> timeStamp >> interface >> id_data;

        //extract id_data such the the id is the string before # and data is string after #. 
        const std::string delimiter = "#";
        std::string id = id_data.substr(0, id_data.find(delimiter));
        std::string data = id_data.substr(id_data.find(delimiter) + 1 , id_data.length());

        //check if id is 705 (hex)
        if (id != wheelSpeedCANId) { 
            continue;
        }

        struct CANData canData = extractCANData(data, id);
        
        output << timeStamp << ": " << "WheelSpeedFR: "  << std::fixed << std::setprecision(1) << canData.wheelSpeedFR << endl;
        output << timeStamp << ": " << "WheelSpeedRR: "  << std::fixed << std::setprecision(1) << canData.WheelSpeedRR << endl;
    }   

    return 0;
}


struct CANData extractCANData(std::string data, std::string id) {

    //converting hex string to unsigned long long
    unsigned long long dataInt = std::stoull(data, nullptr, 16);
    
    // extracting wheel speed data from the dataInt
    double wheelSpeedFR = (dataInt >> 48) & 0xFFFF;
    double wheelSpeedRR = (dataInt >> 16) & 0xFFFF;
    
    //converting to actual wheel speed
    wheelSpeedFR = wheelSpeedFR * conversionFactor;
    wheelSpeedRR = wheelSpeedRR * conversionFactor;

    struct CANData canData = {wheelSpeedFR, wheelSpeedRR};

    return canData;
} 