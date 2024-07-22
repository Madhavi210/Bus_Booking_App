import { Fare } from '../model/fare.model';
import { Route } from '../model/route.model';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';

class FareService {
    public static async getFareByRoute(routeId: string): Promise<any> {
        const fare = await Fare.findOne({ route: routeId }).exec();
        if (!fare) {
            throw new AppError(
                StatusConstants.NOT_FOUND.body.message,
                StatusConstants.NOT_FOUND.httpStatusCode
            );
        }
        return fare;
    }

    public static async setFare(
        routeId: string, 
        baseFarePerKm: number, 
        governmentTaxPercentage: number
    ): Promise<any> {
        
        const route = await Route.findById(routeId).exec();

        if (!route) {
            throw new AppError(
                StatusConstants.NOT_FOUND.body.message,
                StatusConstants.NOT_FOUND.httpStatusCode
            );
        }

        const fare = await Fare.findOneAndUpdate(
            { route: routeId },
            { baseFarePerKm, governmentTaxPercentage },
            { new: true, upsert: true }
        ).exec();

        return fare;
    }

    public static calculateFare(distance: number, baseFarePerKm: number, governmentTaxPercentage: number): number {
        const fare = distance * baseFarePerKm;
        const tax = (fare * governmentTaxPercentage) / 100;
        return fare + tax;
    }

    public static calculateTotalFare(distance: number, baseFarePerKm: number, governmentTaxPercentage: number, paymentMethod: string): number {
        const baseFare = this.calculateFare(distance, baseFarePerKm, governmentTaxPercentage);
        const additionalCharge = paymentMethod === 'cash' ? 0 : 26;
        return baseFare + additionalCharge;
    }
}

export default FareService;
