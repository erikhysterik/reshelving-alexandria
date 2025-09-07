export default function LegacyLibraryPage() {
  return (
    <div>
      <h1>Legacy Library</h1>
      <p>Welcome to the Legacy Library. Browse our collection of books.</p>
      <ul>
        <li><a href="/legacy-library/books">Browse All Books</a></li>
        <li><a href="/legacy-library/book/sample-reference">View Sample Book</a></li>
      </ul>
    </div>
  )
}

export const metadata = {
  title: 'Legacy Library',
  description: 'Browse our collection of books',
}