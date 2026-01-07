import { useTranslations } from '@/lib/i18n';

/**
 * User account page - requires user authentication
 */
export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('common.account')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Navigation */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Menu</h2>
          <nav className="space-y-2">
            <a href="#" className="block py-2 hover:text-gray-600">Profile</a>
            <a href="#" className="block py-2 hover:text-gray-600">Orders</a>
            <a href="#" className="block py-2 hover:text-gray-600">Addresses</a>
            <a href="#" className="block py-2 hover:text-gray-600">Settings</a>
          </nav>
        </div>
        
        {/* Account Content */}
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-4 py-2"
                  defaultValue="john@example.com"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

