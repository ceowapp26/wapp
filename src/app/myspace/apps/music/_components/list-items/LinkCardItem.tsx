import Link from 'next/link';

const LinkCardItem = ({ href, imgSrc, title, description }) => {
    return (
        <li className='flex flex-col items-center justify-center hover:opacity-75'>
            <Link className='flex flex-col items-center justify-center' href={ href }>
                <img className="rounded-full p-2" src={ imgSrc } width={65} height={65} alt="" />
                <strong className="block p-2 text-white">{ title }</strong>
                
                {
                    description &&
                    <small className="block p-2 text-white">{ description }</small>
                }
            </Link>
        </li>
    );
};

export default LinkCardItem;
