import moment, { isDate } from 'moment';
import * as yup from 'yup';
import { GroupByKeys } from './elasticSearch.interfaces';

export const isValidDate = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    return moment(value, true).isValid();
};
export const reportQueryParamsValidator = yup
    .object()
    .shape({
        dateFrom: yup.string().test('isValid', 'From date is invalid', isValidDate).nullable(),
        dateTo: yup.string().test('isValid', 'To date is invalid', isValidDate).nullable(),
        appowner_id: yup.string().nullable(),
        campaign_id: yup.string().nullable(),
        demand_type: yup.mixed().oneOf(['direct', 'programmatic']),
        page: yup.string().matches(/^\d+$/),
        size: yup.string().matches(/^\d+$/),
        sort: yup.mixed().oneOf(['asc', 'desc']),
        groupBy: yup.string().test(function (value: any) {
            if (!value) return true;
            return value.split(',').find((key: any) => !(Object.values(GroupByKeys).indexOf(key) === -1));
        }),
    })
    .noUnknown();
