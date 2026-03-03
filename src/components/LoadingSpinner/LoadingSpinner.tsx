import './LoadingSpinner.css';

interface Props {
    text?: string;
}

export default function LoadingSpinner({ text = 'Loading...' }: Props) {
    return (
        <div className="spinner-wrap">
            <div className="spinner" />
            <p className="spinner-text">{text}</p>
        </div>
    );
}
