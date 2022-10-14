type CompanyProps = {
  name: string;
  category: string;
};

export const Company = ({ name, category }: CompanyProps) => {
  return (
    <article>
      <h3>{name}</h3>
      <p>{category}</p>
    </article>
  );
};
