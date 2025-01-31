import Image from 'next/image'
import {iBook} from '@/mocks/book/book-mockdata'

export const SearchBookCard = (props : iBook) => {
    const {title, content, cover_img, tag, like, view, created_at, updated_at} = props;

    return(
        <div className="rounded-[15px] border border-solid flex flex-col items-center justify-center">
            <Image src={cover_img} alt={`${title}_img`} className="h-[200px]" height={160} width={100} />
            <h5>{title}</h5>
        </div>
    )
}