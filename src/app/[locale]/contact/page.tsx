'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(t('form.success'), 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {t('title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full" />
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Téléphone</h3>
                <a href={`tel:${tCommon('phone')}`} className="text-primary hover:underline">
                  {tCommon('phone')}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <a href={`mailto:${tCommon('email')}`} className="text-primary hover:underline">
                  {tCommon('email')}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Adresse</h3>
                <p className="text-gray-600">{tCommon('address')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Horaires</h3>
                <p className="text-gray-600">Lun - Sam: 9h - 18h</p>
                <p className="text-gray-600">Dim: Fermé</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      {t('form.name')} *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      {t('form.email')} *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    {t('form.subject')} *
                  </label>
                  <Select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="info">{t('form.subjects.info')}</option>
                    <option value="order">{t('form.subjects.order')}</option>
                    <option value="custom">{t('form.subjects.custom')}</option>
                    <option value="other">{t('form.subjects.other')}</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    {t('form.message')} *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[150px]"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  {t('form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
