import moment from 'moment';
import * as yup from 'yup';
import { AdType, ContentType, DemandType, GroupByKeys, ReportType } from './elasticSearch.interfaces';

export const isValidDate = (value: any): boolean => {
    if (!value) return false;
    return moment(value, true).isValid();
};
export const validateRouteParam = yup
    .string()
    .oneOf(Object.values(ReportType))
    .required()
    .typeError('Invalid route param should be one of campaign || content || adtag');
export const reportQueryParamsValidator = yup
    .object()
    .shape({
        dateFrom: yup.string().test('isValid', 'From date is invalid', isValidDate),
        dateTo: yup.string().test('isValid', 'To date is invalid', isValidDate),

        appowner_id: yup.string().nullable(),
        campaign_id: yup.string().nullable(),
        ad_tag_id: yup.string().nullable(),
        content_id: yup.string().nullable(),
        after_key: yup.string().nullable(),

        ad_type: yup.mixed().oneOf(Object.values(AdType)),
        content_type: yup.mixed().oneOf(Object.values(ContentType)),
        demand_type: yup.mixed().oneOf(Object.values(DemandType)),

        page: yup.string().matches(/^\d+$/),
        size: yup.string().matches(/^\d+$/),
        sort: yup.mixed().oneOf(['asc', 'desc']),
        groupBy: yup.string().test(function (value: any) {
            if (!value) return true;
            return value.split(',').find((key: any) => !(Object.values(GroupByKeys).indexOf(key) === -1));
        }),
    })
    .noUnknown();
