import { BannerCategory } from "./banner-category";

export interface Banner{
    bannerId?:number;
    bannerName?:string;
    bannerCategoryId?:number;
    bannerCategory?:BannerCategory
}