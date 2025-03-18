import sys, os, os.path
from bs4 import BeautifulSoup as BS
import bs4.element as BSElem

tags = {
    'annotationfile' : ('div', 'annotationfile'),
    'section': ('div', 'section'),
    'n': ('span', 'n'),
    'tl': ('span', 'tl'),
    'tltxt': ('span', 'tltxt'),
    'refn': ('span', 'refn'),
    'tag': ('span', 'tag')
}

def depth_search(root, debug=False):
    for node in root.contents:
        if hasattr(node, 'contents'):
            for elem in depth_search(node, debug):
                yield elem
        yield node

def make_file(input_filename, output_filename):
    with open(input_filename) as af: infile = BS(af, features="html.parser")

    for elem in depth_search(infile):
        if elem.name in tags:
            name, prefix = tags[elem.name]
            elem.name = name
            elem.attrs['data-v'] = elem.attrs.get("v", "*")
            elem.attrs['class'] = f'annotation {prefix}'
            if 'v' in elem.attrs: del elem.attrs['v']
    
    with open(output_filename, 'w') as of:
        of.write(str(infile))
    
def make_specified_file():
    if len(sys.argv) == 1:
        print("no input file provided!")
        sys.exit()

    else: annotation_file = sys.argv[1]
    output_file = len(sys.argv) > 2 and sys.argv[2] or annotation_file+'.output.md'
    make_file(annotation_file, output_file)
   
    
def make_all_files_in_annotation_directory():
    root_directory = os.getcwd()
    annotation_directory = os.path.join(root_directory, 'annotation_files')
    print(os.listdir(annotation_directory))
    for input_file in os.listdir(annotation_directory):
        if input_file.endswith('.md'):
            input_file_path = os.path.join(annotation_directory, input_file)
            output_file_path = os.path.join(root_directory, input_file)
            make_file(input_file_path, output_file_path)
            

if __name__=='__main__':
    if len(sys.argv) == 1:
        make_all_files_in_annotation_directory()

    else:
        make_specified_file()
