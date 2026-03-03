import './Pagination.css'

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    const getVisible = () => {
        if (totalPages <= 7) return pages;

        if (currentPage <= 4) {
            return [...pages.slice(0, 5), -1 , totalPages];
        }
        if (currentPage >= totalPages - 3) {
            return [1, -1, ...pages.slice(totalPages - 5)];
        }
        return [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages];
    }

    return (
        <div className="pagination">
            <button
                className="pagination__btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ←
            </button>

            {getVisible().map((p, idx) => {
                if (p < 0) return <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                return (
                    <button
                        key={p}
                        className={`pagination__btn ${p === currentPage ? 'pagination__btn--active' : ''}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            })}

            <button 
                className="pagination__btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                →
            </button>

        </div>
    )
}