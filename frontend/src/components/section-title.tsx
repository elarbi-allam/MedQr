export default function SectionTitle({ title }: { title: string }) {
    return (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-[-1px] leading-[130%] flex items-center gap-2">
            <span className="size-4 bg-brand-2/30 rounded-full flex items-center justify-center animate-pulse">
                <span className="size-2 bg-brand-2 rounded-full"></span>
            </span>
            {title}
        </h2>
    );
}