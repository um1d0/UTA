export interface category {
 id: number;
 name: string;
 imageUrl: string;
 description: string;
 productcount: number;
 candelete: boolean;
}

export interface product {
    id: number;
    name: string;
    stock: number;
    brand: string;
    price: number;
    imageurl: string;
    isFavorite: boolean;
    rating: number;
    createdAt: string;
    canDelete: boolean;
    category: category;
}

export interface productresponse{
    items: product[];
    currentPage: number;
    totalpage:number;
    pagesize:number;
    hasmore:boolean;
}