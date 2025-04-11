import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Database } from '@/lib/database.types';

type Vault = Database['public']['Tables']['vaults']['Row'];

interface VaultGridProps {
  vaults: Vault[];
  onCreateVault: () => void;
}

export function VaultGrid({ vaults, onCreateVault }: VaultGridProps) {
  const navigate = useNavigate();

  const getVaultBackground = (themes: string[]) => {
    if (themes.includes('sepia')) return 'bg-legacy-sepia';
    if (themes.includes('sage')) return 'bg-legacy-sage';
    if (themes.includes('parchment')) return 'bg-legacy-parchment';
    return 'bg-legacy-cream';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Create New Vault Card */}
      <Card 
        className="border-2 border-dashed border-legacy-sepia bg-white/50 hover:bg-white/80 transition-all cursor-pointer flex flex-col items-center justify-center h-64"
        onClick={onCreateVault}
      >
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="rounded-full bg-legacy-sepia/20 p-3 mb-4">
            <Plus className="h-8 w-8 text-legacy-copper" />
          </div>
          <p className="font-serif text-xl text-legacy-copper">Create New Vault</p>
          <p className="text-sm text-legacy-ink/60 mt-2">Start preserving memories</p>
        </CardContent>
      </Card>

      {/* Existing Vaults */}
      {vaults.map((vault) => (
        <Card 
          key={vault.id}
          className={`overflow-hidden hover:shadow-lg transition-all h-64 cursor-pointer ${getVaultBackground(vault.theme)}`}
          onClick={() => navigate(`/vault/${vault.id}`)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-serif text-legacy-mahogany">{vault.name}</CardTitle>
            <CardDescription className="text-legacy-ink/70">
              Created {new Date(vault.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-28">
            <p className="text-legacy-ink/80 line-clamp-3">
              A collection of treasured memories and stories
            </p>
          </CardContent>
          <CardFooter className="border-t border-legacy-sepia/30 pt-3 pb-3 bg-white/30">
            <Button 
              variant="outline" 
              className="text-xs bg-white/70 border-legacy-copper text-legacy-copper hover:bg-legacy-copper hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vault/${vault.id}`);
              }}
            >
              Open Vault
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
